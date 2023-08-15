import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PokeComponent } from './poke.component';
import { MovesetComponent } from './components/moveset/moveset.component';
import { LeftComponent } from './components/left/left.component';
import { RightComponent } from './components/right/right.component';
import { EffectivenessComponent } from './components/effectiveness/effectiveness.component';
import { PokemonComponent } from './components/pokemon/pokemon.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';

@NgModule({
  declarations: [
    PokeComponent,
    // MovesetComponent,
    EvaluationComponent,
    LeftComponent,
    RightComponent,
    EffectivenessComponent,
    PokemonComponent,
    AccordionComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [PokeComponent]
})
export class PokeModule { }
